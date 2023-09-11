import React from "react";
import cn from "classnames";

import styles from "./StyleziedButton.module.css";

type TTypesStyleziedButton = "button" | "submit" | "reset"

const StyleziedButton = ({
                             classname = "",
                             primary = false,
                             onClick = () => {
                             },
                             children = "",
                             disabled = false,
                             type = "button"
                         }) => {
    // @ts-ignore
    return (
        <button
            className={cn(
                styles.styleziedButton,
                primary && styles.styleziedButton___primary,
                classname
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default StyleziedButton;
