import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-medicamento-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './medicamento-form.html',
  styleUrl: './medicamento-form.css'
})
export class MedicamentoFormComponent implements OnInit {
  esEdicion = false;
  medicamento = {
    nombre: '', categoria: '', precio: 0,
    stock: 0, vencimiento: '', descripcion: ''
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      // Aquí cargarás desde IndexedDB por id
    }
  }

  guardar() {
    if (!this.medicamento.nombre || !this.medicamento.precio) {
      alert('Completa los campos obligatorios');
      return;
    }
    // Aquí guardarás en IndexedDB
    alert(this.esEdicion ? 'Medicamento actualizado' : 'Medicamento guardado');
    this.router.navigate(['/medicamentos']);
  }
}