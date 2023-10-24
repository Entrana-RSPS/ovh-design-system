import type { OsdsCartHeader } from '../osds-cart-header';
import { OsdsCart } from '../../osds-cart/osds-cart';
import { OdsLogger } from '@ovhcloud/ods-common-core';
import { HTMLStencilElement } from '@stencil/core/internal';

class OdsCartHeaderController {
  private readonly logger = new OdsLogger('OdsCartHeaderController');
  private component: OsdsCartHeader;

  constructor(component: OsdsCartHeader) {
    this.component = component;
  }

  /**
   * Init cart from cart container
   */
  initCart(): void {
    this.component.cart = this.component.el.closest('osds-cart') as (HTMLStencilElement & OsdsCart);
    if (!this.component.cart) {
      this.logger.warn('A cart is mandatory.');
    }
  }

  /**
   * Header title validation
   */
  validateHeaderTitle(): void {
    if (!this.component.headerTitle) {
      throw new Error('[OsdsCartHeader] header-title attribute is mandatory');
    }
  }
}

export {
  OdsCartHeaderController,
};
