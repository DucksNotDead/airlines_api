import { PdfDocument } from '@ironsoftware/ironpdf/src/public/pdfDocument';
import { Injectable } from '@nestjs/common';

type TPropertyLabel = string | [string, string];

type TSchemeRecursive<T, Q = T extends any[] ? T[number] : T> = {
  [P in keyof Q]: Q[P] extends object | null
    ? [string, TSchemeRecursive<Q[P]>]
    : TPropertyLabel;
};

@Injectable()
export class PdfService {
  private styles(other?: string) {
    return `
        <style>
          * {
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 14px;
              color: #999;
          }
          h1 {
              margin: 0 0 16px;
              text-align: center;
              font-size: 28px;
              color: #333;
          }
          h2 {
              margin: 0 0 6px;
              font-size: 22px;
              font-weight: 700;
              color: #333;
          }
          h3 {
              margin: 0;
              font-weight: 500;
              font-size: 16px;
              color: #333;
          }
          main {
              width: 920px;
              padding: 12px 24px;
          }
          .__separator {
              width: 100%;
              height: 1px;
              background-color: #999;
              margin: 24px 0;
          }
          .__section {
              padding: 16px 0 0;
              width: 100%;
          }
          .__section > div {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              gap: 8px 32px;
          }
          .__array_item {
              display: flex;
              align-items: center;
              gap: 24px;
          }
          .__array_item > div {
              border-left: 2px solid #333;
              padding-left: 12px;
          }
          .__property {
              display: flex;
              flex-direction: column;
          }
          ${other ?? ''}
        </style>
    `;
  }

  private section(
    title: string | number | null,
    data: string,
    fromArray?: boolean,
  ) {
    return `
			<div class="__section${fromArray ? ' __array_item' : ''}">
				${title !== null ? `<h2>${title}</h2>` : ''}
				<div>${data}</div>
			</div>
		`;
  }

  private property(
    key: string,
    value?: string | number | boolean | null,
    postfix?: string,
  ) {
    let data = value;

    if (typeof value !== 'string') {
      if (typeof value === 'boolean') {
        data = value ? 'Да' : 'Нет';
      } else if ([null, undefined].includes(value as null | undefined)) {
        data = 'Отсутствует';
      }
    }

    return `
			<div class="__property">
				<h3>${key}</h3>
				<span>${data}${postfix ?? ''}</span>
			</div>
		`;
  }

  private separator() {
    return `<div class="__separator"></div>`;
  }

  private recursiveParser<T>(item: T, scheme: TSchemeRecursive<T>): string {
    let html = '';

    let currentIteration = 0;
    for (const itemKey in scheme) {
      const value = item ? item[itemKey as keyof T] : null;
      const schemeValue = scheme[itemKey];
      if (typeof value === 'object') {
        const [schemeName, innerScheme] = schemeValue as [string, any];
        if (Array.isArray(value)) {
          let items = '';
          for (const index in value) {
            const arrayItem = value[index];
            items += this.section(
              Number(index) + 1,
              this.recursiveParser(arrayItem, innerScheme),
              true,
            );
          }
          html += this.section(schemeName, value.length > 0 ? items : 'Пусто');
        } else {
          html += this.section(
            schemeName,
            value ? this.recursiveParser(value, innerScheme) : 'Пусто',
          );
        }
      } else {
        let label: any = schemeValue;
        let postfix: any = undefined;

        if (Array.isArray(schemeValue)) {
          label = schemeValue[0];
          postfix = schemeValue[1];
        }

        html += this.property(label, value as any, postfix);
      }
      currentIteration++;
    }

    return html;
  }

  async genPdfFromData<T>(
    title: string,
    data: T[],
    scheme: TSchemeRecursive<T>,
    styles?: string,
  ) {
    let body = '';

    for (const index in data)
      body +=
        this.recursiveParser(data[index], scheme) +
        (Number(index) < data.length - 1 ? this.separator() : '');

    const html = `
				${this.styles(styles)}
				<main>
					<h1>${title}</h1>
					${this.section(null, body)}
				</main>
		`;

    const page = await PdfDocument.fromHtml(html);

    return page.saveAsBuffer();
  }
}
