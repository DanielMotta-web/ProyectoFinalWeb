export interface IEspecie {
    nombre_cientifico?: string;
    nombre_comun: string;
    familia?: string;
    cantidad_muestras: number;
    estado_planta: 'viva' | 'seca' | 'otro';
    fotografias_especies: string[];
  }