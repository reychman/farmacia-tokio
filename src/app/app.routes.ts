import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    {
        path: 'medicamentos',
        loadComponent: () => import('./features/medicamentos/medicamento-list/medicamento-list').then(m => m.MedicamentoListComponent),
    },
    {
        path: 'medicamentos/nuevo',
        loadComponent: () => import('./features/medicamentos/medicamento-form/medicamento-form').then(m => m.MedicamentoFormComponent),
    },
    {
        path: 'medicamentos/editar/:id',
        loadComponent: () => import('./features/medicamentos/medicamento-form/medicamento-form').then(m => m.MedicamentoFormComponent),
    },
    {
        path: 'ventas',
        loadComponent: () => import('./features/ventas/venta-list/venta-list').then(m => m.VentaListComponent),
    },
    {
        path: 'ventas/nueva',
        loadComponent: () => import('./features/ventas/venta-nueva/venta-nueva').then(m => m.VentaNuevaComponent),
    },
    {
        path: 'ventas/detalle/:id',
        loadComponent: () => import('./features/ventas/venta-detalle/venta-detalle').then(m => m.VentaDetalleComponent),
    },
    { path: '**', redirectTo: 'dashboard' },
];