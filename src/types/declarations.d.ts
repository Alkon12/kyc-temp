type Dict<T = unknown> = Record<string, T>
type Merge<A, B> = Omit<A, Extract<keyof A, keyof B>> & B
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
type WithOptional<T, K extends keyof T> = T & { [P in K]?: T[P] }

declare module '*.graphql' {
  import { DocumentNode } from 'graphql'

  const value: DocumentNode
  export = value
}

declare module '*.html' {
  // Uses the template-string-loader, see `webpack.base.js`
  export = (scope: Record<string, any>) => stringType
}

declare module '*.hbs' {
  // Uses the handlebars-loader, see `webpack.base.js`
  export = (scope: Record<string, any>) => stringType
}

declare module '*.yml' {
  export = string
}

declare module 'react-slick' {
    import { Component } from 'react';

    interface Settings {
        dots?: boolean;
        infinite?: boolean;
        speed?: number;
        slidesToShow?: number;
        slidesToScroll?: number;
        [key: string]: any;
    }

    export default class Slider extends Component<Settings> { }
}

declare module 'bootstrap/dist/js/bootstrap.bundle.min' {
    const bootstrap: any;
    export default bootstrap;
}

declare module 'react-owl-carousel' {
    import React from 'react';

    interface Options {
        loop?: boolean;
        margin?: number;
        responsiveClass?: boolean;
        responsive?: {
            0?: {
                items?: number;
                nav?: boolean;
            };
            600?: {
                items?: number;
                nav?: boolean;
            };
            1000?: {
                items?: number;
                nav?: boolean;
                loop?: boolean;
            };
        };
        className?: string;
    }

    const OwlCarousel: React.FC<Options & React.HTMLAttributes<HTMLDivElement>>;

    export default OwlCarousel;
}