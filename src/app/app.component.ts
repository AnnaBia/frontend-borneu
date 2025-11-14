import { Component } from '@angular/core';
import { PoChartOptions, PoChartSerie, PoChartType, PoHeaderActionTool, PoHelperOptions, PoThemeA11yEnum, poThemeDefault, PoThemeService, PoThemeTypeEnum } from '@po-ui/ng-components';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {

  chartClimaCategories: string[] = [];
  chartClimaOptions: PoChartOptions = {
    descriptionChart: 'Mostra a correlação entre temperatura média e precipitação na região.',
    fillPoints: true,
  };
  chartClimaSeries: PoChartSerie[] = [];

  chartDesmatamentoCategories: Array<string> = [];
  chartDesmatamentoOptions: PoChartOptions = {
    descriptionChart: 'Representa a área desmatada anualmente em km².',
    fillPoints: true,
  };
  chartDesmatamentoSeries: Array<PoChartSerie> = [];

  chartNdviCategories: Array<string> = [];
  chartNdviOptions: PoChartOptions = {
    descriptionChart: 'Índice de vegetação usado para monitorar a saúde das plantas e florestas.',
  };
  chartNdviSeries: Array<PoChartSerie> = [];

  helperClima: PoHelperOptions = {
    title: 'Clima – Temperatura e Precipitação',
    content: 'A temperatura média e o volume de chuvas influenciam diretamente a regeneração da vegetação. Menos chuvas e mais calor aumentam o risco de degradação.',
    type: 'info'
  };

  helperDesmatamento: PoHelperOptions = {
    title: 'Área Desmatada',
    content: 'Representa a área anual de floresta perdida (km²). O aumento indica avanço da conversão florestal para uso agrícola ou urbano.',
    type: 'info'
  };

  helperNdvi: PoHelperOptions = {
    title: 'NDVI (Índice de Vegetação)',
    content: 'Varia de -1 a 1. Valores próximos de 0 indicam pouca vegetação; acima de 0.6, vegetação densa e saudável.',
    type: 'info'
  };

  opcoesPeriodo = [
    { value: 'real', label: 'Somente dados observados' },
    { value: 'previsto', label: 'Com previsão até 2030' }
  ];
  periodoSelecionado: 'real' | 'previsto' = 'real';
  temaDark: boolean = true;

  constructor(private tema: PoThemeService, private appService: AppService) {
    this.tema.setCurrentThemeA11y(PoThemeA11yEnum.AA);
    this.tema.setA11yDefaultSizeSmall(true);
  }

  ngOnInit(): void {
    this.carregarNdvi();
    this.carregarClima();
    this.carregarDesmatamento();
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

  carregarClima(incluirPrevisao: boolean = false): void {
    const serviceCall = incluirPrevisao
      ? this.appService.getPrevisaoClima()
      : this.appService.getClima();

    serviceCall.subscribe({
      next: (dados: any) => {
        if (incluirPrevisao && dados.pontos) {
          this.chartClimaCategories = dados.anos.map((a: number) => String(a));

          const precipObservada = dados.pontos
            .filter((p: any) => p.type === 'observed')
            .map((p: any) => p.precip);

          const tempObservada = dados.pontos
            .filter((p: any) => p.type === 'observed')
            .map((p: any) => p.temp);

          const precipPrevista = dados.pontos
            .filter((p: any) => p.type === 'predicted')
            .map((p: any) => p.precip);

          const tempPrevista = dados.pontos
            .filter((p: any) => p.type === 'predicted')
            .map((p: any) => p.temp);

          const dataPrecipPrevista = Array(precipObservada.length)
            .fill(null)
            .concat(precipPrevista);

          const dataTempPrevista = Array(tempObservada.length)
            .fill(null)
            .concat(tempPrevista);

          this.chartClimaSeries = [
            {
              label: 'Precipitação (Real)',
              type: PoChartType.Column,
              data: precipObservada.concat(Array(precipPrevista.length).fill(null))
            },
            {
              label: 'Temperatura (Real)',
              type: PoChartType.Line,
              data: tempObservada.concat(Array(tempPrevista.length).fill(null))
            },
            {
              label: 'Precipitação (Prevista)',
              type: PoChartType.Column,
              data: dataPrecipPrevista
            },
            {
              label: 'Temperatura (Prevista)',
              type: PoChartType.Line,
              data: dataTempPrevista
            }
          ];
        } else if (Array.isArray(dados) && dados.length) {
          this.chartClimaCategories = dados.map(d => String(d.year));
          this.chartClimaSeries = [
            {
              label: 'Precipitação (mm)',
              type: PoChartType.Column,
              data: dados.map(d => d.precip)
            },
            {
              label: 'Temperatura (°C)',
              type: PoChartType.Line,
              data: dados.map(d => d.temp)
            }
          ];
        }
      },
      error: err => console.error('Erro ao carregar dados do clima:', err)
    });
  }

  carregarDesmatamento(incluirPrevisao: boolean = false): void {
    const serviceCall = incluirPrevisao
      ? this.appService.getPrevisaoDesmatamento()
      : this.appService.getDesmatamento();

    serviceCall.subscribe({
      next: (dados: any) => {
        if (incluirPrevisao && dados.pontos) {
          this.chartDesmatamentoCategories = dados.anos.map((y: number) => String(y));

          const observados = dados.pontos
            .filter((p: any) => p.type === 'observed')
            .map((p: any) => p.value);

          const previstos = dados.pontos
            .filter((p: any) => p.type === 'predicted')
            .map((p: any) => p.value);

          const dataPrevistos = Array(observados.length)
            .fill(null)
            .concat(previstos);

          this.chartDesmatamentoSeries = [
            {
              label: 'Área Desmatada (Real)',
              data: observados.concat(Array(previstos.length).fill(null)),
              type: PoChartType.Column
            },
            {
              label: 'Área Desmatada (Prevista)',
              data: dataPrevistos,
              type: PoChartType.Line
            }
          ];
        } else if (dados?.series?.length) {
          this.chartDesmatamentoCategories = dados.years.map((y: number) => String(y));
          this.chartDesmatamentoSeries = dados.series.map((s: any) => ({
            label: s.label,
            data: s.data,
            type: PoChartType.Column
          }));
        }
      },
      error: err => console.error('Erro ao carregar desmatamento:', err)
    });
  }

  carregarNdvi(incluirPrevisao: boolean = false): void {
    const serviceCall = incluirPrevisao
      ? this.appService.getPrevisaoNdvi()
      : this.appService.getNdvi();

    serviceCall.subscribe({
      next: (dados: any) => {
        if (incluirPrevisao && dados.pontos) {
          this.chartNdviCategories = dados.anos.map((a: number) => String(a));

          const observados = dados.pontos
            .filter((p: any) => p.type === 'observed')
            .map((p: any) => p.value);

          const previstos = dados.pontos
            .filter((p: any) => p.type === 'predicted')
            .map((p: any) => p.value);

          const dataPrevistos = Array(observados.length)
            .fill(null)
            .concat(previstos);

          this.chartNdviSeries = [
            {
              label: 'NDVI Observado',
              data: observados.concat(Array(previstos.length).fill(null)),
              type: PoChartType.Line
            },
            {
              label: 'NDVI Previsto',
              data: dataPrevistos,
              type: PoChartType.Line
            }
          ];
        } else if (Array.isArray(dados)) {
          this.chartNdviCategories = dados.map(d => String(d.year));
          this.chartNdviSeries = [
            {
              label: 'NDVI Real',
              data: dados.map(d => d.ndvi),
              type: PoChartType.Line
            }
          ];
        }
      },
      error: err => console.error('Erro ao carregar NDVI:', err)
    });
  }

  onTogglePeriodo(value: 'real' | 'previsto') {
    this.carregarClima(value === 'previsto');
    this.carregarDesmatamento(value === 'previsto');
    this.carregarNdvi(value === 'previsto');
  }
}
