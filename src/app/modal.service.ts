/**
 * Service for injecting modals into the page.
 */
import { Injectable, ViewContainerRef, ReflectiveInjector, Type, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private viewContainerRef: ViewContainerRef;
  modalRef?: ComponentRef<any> = null;

  constructor(private resolver: ComponentFactoryResolver) {}

  /**
   * Sets the container for where the modals will go. See ModalContainer component.
   */
  RegisterContainerRef(vcRef: ViewContainerRef) {
    this.viewContainerRef = vcRef;
  }
  /**
   * Create and open a modal.
   * @param {Type} component Reference to the modal component type to open
   * @param {Object} parameters Properties to set on the modal component.
   * @returns
   */
  open<T>(component: Type<T>, parameters?: Object) : Observable<ComponentRef<T>> {
    const componentRef$ = new ReplaySubject();
    const factory = this.resolver.resolveComponentFactory(component);
    const componentRef = this.viewContainerRef.createComponent(factory);
    Object.assign(componentRef.instance, parameters);
    componentRef.instance['destroy'] = () => {
      this.modalRef = null;
      componentRef.destroy();
    };

    this.modalRef = componentRef;
    componentRef$.next(componentRef);
    componentRef$.complete();
    return <Observable<ComponentRef<T>>>componentRef$.asObservable();
  }
}
