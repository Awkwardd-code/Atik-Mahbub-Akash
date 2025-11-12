import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type ButtonBaseProps = {
  name: string;
  isBeam?: boolean;
  containerClass?: string;
};

type NativeButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AnchorButtonProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> & {
    href: string;
  };

type ButtonProps = NativeButtonProps | AnchorButtonProps;

const Button = ({ name, isBeam = false, containerClass = '', ...restProps }: ButtonProps) => {
  const className = `btn ${containerClass}`.trim();
  const content = (
    <>
      {isBeam && (
        <span className="relative flex h-3 w-3">
          <span className="btn-ping" />
          <span className="btn-ping_dot" />
        </span>
      )}
      {name}
    </>
  );

  if ('href' in restProps && typeof restProps.href === 'string') {
    const { href, ...anchorProps } = restProps;

    return (
      <a className={className} href={href} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { type, ...buttonProps } = restProps as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button className={className} type={type ?? 'button'} {...buttonProps}>
      {content}
    </button>
  );
};

export type { ButtonProps };
export default Button;
