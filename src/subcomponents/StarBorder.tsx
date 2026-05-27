import React from 'react';
import '../app/globals.css'

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties['animationDuration'];
    thickness?: number;
};

const StarBorder = <T extends React.ElementType = 'button'>({
                                                                as,
                                                                className = '',
                                                                color = 'magenta',
                                                                speed = '3s',
                                                                thickness = 2,
                                                                children,
                                                                ...rest
                                                            }: StarBorderProps<T>) => {
    return (
        <div
            className={`star-border-container ${className}`}
            {...(rest as any)}
            style={{
                padding: `${thickness}px`,
                ...(rest as any).style
            }}
        >
            <div
                className="border-gradient-bottom"
                style={{
                    background: `radial-gradient(circle, ${color}, transparent 10%)`,
                    animationDuration: speed
                }}
            ></div>
            <div
                className="border-gradient-top"
                style={{
                    background: `radial-gradient(circle, ${color}, transparent 10%)`,
                    animationDuration: speed
                }}
            ></div>
            <div className="inner-content">{children}</div>
        </div>
    );
};

export default StarBorder;