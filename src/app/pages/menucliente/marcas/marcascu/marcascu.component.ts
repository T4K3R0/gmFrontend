import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EventoService } from 'src/app/services/service.index';
import swal from 'sweetalert2';
import { SWALCONFIG_TOAST } from 'src/app/config/config';

@Component({
  selector: 'app-marcascu',
  templateUrl: './marcascu.component.html',
  styleUrls: ['./marcascu.component.css']
})
export class MarcascuComponent implements OnInit {
  @Output()
  action = new EventEmitter();

  data: any = {};

  forma: FormGroup;

  constructor(
    public modalRef: BsModalRef,
    public modalService: BsModalService,
    private eventoService: EventoService,
  ) {
    this.data = this.modalService.config.initialState;
  }

  ngOnInit() {
    this.forma = new FormGroup({
      titulo: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      img: new FormControl(null, []),
      telefono: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      ciudad: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      estado: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      representante: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      ambito: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      telefonodos: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),

    });

    if (this.data.idmarca) {
      this.eventoService.getMarcaById(this.data.idmarca).subscribe(
        (res: any) => {

          this.forma.get('titulo').setValue(res.data.marcas[0].titulo);
          this.forma.get('telefono').setValue(res.data.marcas[0].telefono);
          this.forma.get('ciudad').setValue(res.data.marcas[0].ciudad);
          this.forma.get('estado').setValue(res.data.marcas[0].estado);
          this.forma.get('representante').setValue(res.data.marcas[0].representante);
          this.forma.get('ambito').setValue(res.data.marcas[0].ambito);
          this.forma.get('telefonodos').setValue(res.data.marcas[0].telefonodos);

        },

        error => {
          const toast = SWALCONFIG_TOAST;
          toast.type = 'error';
          toast.title = 'Ocurrió un error en la petición';
          swal(toast);

        }
      );
    }
  }

  queAccionEs() {
    if (this.data.idmarca) {
      this.actualziarMarca(this.data.idmarca, this.data.idevento);
    } else {
      this.registrarEvento();
    }
  }

  actualziarMarca(idmarca, idevento) {
    const marca = this.forma.value;
    marca.evento = idevento;

    this.eventoService.updateMarcaById(idmarca, marca).subscribe(
      res => {
        console.log(res);
        const toast = SWALCONFIG_TOAST;
        toast.type = 'success';
        toast.title = 'El registro se actualizó correctamente';
        swal(toast);

        this.action.emit();
        this.modalRef.hide();

      },

      error => {
        console.log(error);
        const toast = SWALCONFIG_TOAST;
        toast.type = 'error';
        toast.title = 'Ocurrió un error en la petición';
        swal(toast);

      }
    );
  }

  registrarEvento() {
    if (this.forma.invalid) {
      return;
    }

    const idevento: any = this.modalService.config.initialState;

    this.eventoService.newMarca(idevento.data, this.forma.value).subscribe(
      res => {
        const toast = SWALCONFIG_TOAST;
        toast.type = 'success';
        toast.title = 'El registro se insertó correctamente';
        swal(toast);

        this.action.emit();
        this.modalRef.hide();
      },
      error => {
        const toast = SWALCONFIG_TOAST;
        toast.type = 'error';
        toast.title = 'Ocurrió un error en la petición';
        swal(toast);
      }
    );
  }

}
