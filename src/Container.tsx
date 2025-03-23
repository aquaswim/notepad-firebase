import * as React from "react";

interface TProp {
    fluid?: boolean;
}

function Container({children, fluid}: React.PropsWithChildren<TProp>) {
    let className = "container";
    if (fluid) {
        className = "container-fluid";
    }
    return (
        <main className={className}>
            {children}
        </main>
    );
}

export default Container;