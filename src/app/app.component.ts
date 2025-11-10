import { Component } from '@angular/core';
import { PoChartOptions, PoChartSerie, PoChartType, PoHeaderActionTool, PoThemeA11yEnum, poThemeDefault, PoThemeService, PoThemeTypeEnum } from '@po-ui/ng-components';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  temaDark: boolean = true;

  chartAreaSeries: Array<PoChartSerie> = [];
  chartAreaCategories: Array<string> = [];
  chartAreaOptions: PoChartOptions = {
    fillPoints: true,
    legend: false,
  };

  periodoSelecionado: '2022' | '2030' = '2022';
  opcoesPeriodo = [
    { value: '2022', label: '2022 (dados reais)' },
    { value: '2030', label: '2030 (com previsão)' }
  ];

  constructor(private tema: PoThemeService, private appService: AppService) {
    this.tema.setCurrentThemeA11y(PoThemeA11yEnum.AA);
    this.tema.setA11yDefaultSizeSmall(true);
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  get headerActions(): Array<PoHeaderActionTool> {
    return [
      {
        label: this.temaDark ? 'Tema Light' : 'Tema Dark',
        icon: this.temaDark ? 'an an-sun' : 'an an-moon',
        action: this.aplicaTemaDark.bind(this)
      }
    ];
  }

  aplicaTemaDark() {
    this.temaDark = !this.temaDark;
    const tipoTema = this.temaDark ? PoThemeTypeEnum.dark : PoThemeTypeEnum.light;
    this.tema.setTheme(poThemeDefault, tipoTema, PoThemeA11yEnum.AA);
  }

  carregarDados(incluirPrevisao: boolean = false): void {
    const serviceCall = incluirPrevisao
      ? this.appService.getPrevisao()
      : this.appService.getData();

    serviceCall.subscribe({
      next: (dados: any[]) => {
        if (!Array.isArray(dados) || dados.length === 0) return;

        this.chartAreaCategories = dados.map(d => String(d.year));

        const valores = dados.map(d => Number(d.NDVI ?? d.NDVI_previsto ?? 0));

        this.chartAreaSeries = [
          {
            data: valores,
            type: PoChartType.Area
          }
        ];
      },
      error: err => console.error('Erro ao carregar dados:', err)
    });
  }

  onToggleAno(value: '2022' | '2030') {
    this.carregarDados(value === '2030');
  }
}
