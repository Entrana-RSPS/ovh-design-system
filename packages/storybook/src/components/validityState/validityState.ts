import { type TemplateResult, html } from 'lit-html';

type OdsComponent = {
  getValidity: () => ValidityState,
} & HTMLElement

let oldIsRequired: boolean;
const odsTable = html`
<ods-table id="validity-state-table" size="sm">
  <table style="width: 200px">
    <thead>
      <tr>
        <th scope="col">Key</th>
        <th scope="col">Value</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</ods-table>`;

function ValidityStateTemplateDemo(hasValidityState: boolean, isRequired: boolean, componentName: string, componentSelector: string): TemplateResult | string {
  if (oldIsRequired !== isRequired) {
    oldIsRequired = isRequired;
    const event = new Event('updateValidityState');
    document.dispatchEvent(event);
  }
  const validityStateTemplate = html`
  ${ odsTable }
  <script>
    (async () => {
        await Promise.all([
          await customElements.whenDefined('ods-table'),
          await customElements.whenDefined('ods-${componentName}'),
        ]);
        await window.renderValidityState('${componentSelector}');
    })();
  </script>`;
  return hasValidityState ? validityStateTemplate : '';
}

function ValidityStateTemplateExample(componentName: string, componentSelector: string): TemplateResult | string {
  const validityStateTemplate = html`
  ${ odsTable }
  <script>
    (async () => {
        await Promise.all([
          await customElements.whenDefined('ods-table'),
          await customElements.whenDefined('ods-${componentName}'),
        ]);
        await window.renderValidityState('${componentSelector}');
    })();
  </script>`;
  return validityStateTemplate;
}

async function renderValidityState(componentSelector: string): Promise<void> {
  const component = document.querySelector<OdsComponent>(componentSelector);
  component?.addEventListener('odsChange', async() => {
    console.log('odsChange', )
    await buildTable(component);
  });
  document.addEventListener('updateValidityState', async() => {
    await new Promise((resolve) => setTimeout(resolve, 20));
    await buildTable(component);
  });

  await buildTable(component);
}

async function buildTable(component: OdsComponent | null): Promise<void> {
  const validity = await component?.getValidity();
  console.log('validity', validity);
  const validityStateElement = document.querySelector('#validity-state-table');
  const tr = [];
  for (const key in validity) {
    tr.push({ key, template: `<tr><th scope="row" style="text-align: initial">${key}</th><td>${validity[key as keyof ValidityState]}</td></tr>` } );
  }
  const tbody = validityStateElement?.querySelector('tbody');
  if (tbody) {
    tbody.innerHTML = '';
    tbody.innerHTML = tr.sort((a, b) => a.key.localeCompare(b.key)).map(({ template }) => template).join('');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).renderValidityState = renderValidityState;

export {
  renderValidityState,
  ValidityStateTemplateDemo,
  ValidityStateTemplateExample,
};
