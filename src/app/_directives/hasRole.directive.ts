import { Directive, ViewContainerRef, Input, TemplateRef } from '@angular/core';
import { AuthService } from '../_services/auth.service';

// Structural directives are responsible for HTML layout. They shape and modify the DOM's structure by adding,
// removing, or manipulating elements.
@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  @Input() appHasRole: string[];
  isVisible = false;

  constructor(private viewCotainerRef: ViewContainerRef, private templateRef: TemplateRef<any>, private authService: AuthService ) { }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    const userRoles = this.authService.decodedToken.role as Array<string>;

    // if no roles clear the viewContainerRef
    if (!userRoles) {
      this.viewCotainerRef.clear(); // display nothing
    }

    // if user has role needed then render the element
    if (this.authService.roleMatch(this.appHasRole)) {
      if (!this.isVisible) {
        this.isVisible = true;
        // this.templateRef refers to the element that we're applying the structural directive to
        this.viewCotainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.isVisible = false;
        this.viewCotainerRef.clear();
      }
    }
  }
}
