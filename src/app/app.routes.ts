import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
    },

    {
        path: 'medicamentos',
        loadComponent: () => import('./features/medicamentos/medicamento-list/medicamento-list').then(m => m.MedicamentoListComponent)
    },

    {
        path: 'ventas',
        loadComponent: () => import('./features/ventas/venta-list/venta-list').then(m => m.VentaListComponent)
    },

    {
        path: 'ventas/nueva',
        loadComponent: () => import('./features/ventas/venta-nueva/venta-nueva').then(m => m.VentaNuevaComponent)
    },
];