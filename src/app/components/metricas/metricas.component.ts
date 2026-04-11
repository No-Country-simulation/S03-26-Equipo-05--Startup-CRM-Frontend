import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/api.service';
import { ExportService } from '../../services/export.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface MetricaKpi {
  titulo: string;
  valor: string;
  tendencia: number;
  icono: string;
  color: string;
}

interface EtapaFunnel {
  nombre: string;
  cantidad: number;
  porcentaje: number;
  monto: number;
  color: string;
}

interface ActividadReciente {
  descripcion: string;
  fecha: string;
  tipo: string;
  icono: string;
}

@Component({
  selector: 'app-metricas',
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.css']
})
export class MetricasComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;
  filtroActual: string = 'todos';

  kpis: MetricaKpi[] = [];
  etapasFunnel: EtapaFunnel[] = [];
  topTratos: any[] = [];
  clientesActivos: any[] = [];
  actividades: ActividadReciente[] = [];

  private tratos: any[] = []; // Para botón de exportación
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.isLoading = true;
    
    // Obtener las estadísticas calculadas íntegramente por el backend
    this.dataService.getDashboardAnalytics().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.kpis = data.kpis || [];
        this.etapasFunnel = data.etapasFunnel || [];
        this.topTratos = data.topTratos || [];
        this.clientesActivos = data.clientesActivos || [];
        this.actividades = data.actividades || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del dashboard', err);
        this.isLoading = false;
      }
    });

    // Guardar los tratos listos para exportar en CSV
    this.dataService.getTratos().pipe(
      takeUntil(this.destroy$)
    ).subscribe(t => this.tratos = t);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cambiarFiltro(filtro: string): void {
    this.filtroActual = filtro;
    // Nota: El backend actualmente sirve estadísticas integrales, 
    // se puede extender el API para aceptar el parámetro del filtro temporal.
  }

  getMaxMontoPipeline(): number {
    if (this.etapasFunnel.length === 0) return 1;
    return Math.max(...this.etapasFunnel.map(e => e.monto));
  }

  getBarWidth(monto: number): number {
    const max = this.getMaxMontoPipeline();
    return max > 0 ? Math.round((monto / max) * 100) : 0;
  }

  getFunnelWidth(index: number): number {
    const total = this.etapasFunnel.length;
    if (total === 0) return 100;
    return 100 - (index * (70 / (total - 1 || 1)));
  }

  getEtapaBadgeClass(etapa: string): string {
    const clases: Record<string, string> = {
      'Prospecto': 'bg-blue-100 text-blue-700',
      'Negociación': 'bg-amber-100 text-amber-700',
      'Propuesta': 'bg-purple-100 text-purple-700',
      'Cerrado': 'bg-emerald-100 text-emerald-700'
    };
    return clases[etapa] || 'bg-slate-100 text-slate-700';
  }

  exportarDatos(): void {
    if (this.tratos.length === 0) return;
    this.exportService.exportarTratosCSV(this.tratos);
  }

  imprimirDashboard(): void {
    window.print();
  }
}

