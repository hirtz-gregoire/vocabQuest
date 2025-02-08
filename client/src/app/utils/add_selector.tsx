import Select, {components, StylesConfig} from "react-select";
import {APIS} from "@/app/utils/utils";

export const add_selector = ({
                         options,
                         onOptionSelected,
                         apiToUse,
                     }: {
    options: { value: string, label: string, }[],
    onOptionSelected: (selectedTheme: string) => void,
    apiToUse: APIS
}) => {
    options.push({ value: "add", label: "+" })

    const onAdd = () => {
        // TODO : Ask the API to generate a new option
        // TODO : Visual cues for when the API is loading the thingy
        switch (apiToUse) {
            case APIS.Language:
                console.log("Adding a new language !")
                break;
            case APIS.Theme:
                console.log("Adding a new theme !")
                break;
        }
        // TODO : Wait for the API to create the option then call onThemeSelected
    }

    const customizeOptions = (props: any) => {
        const { data, innerRef, innerProps } = props;

        if (data.value === "add") {
            return (
                <div ref={innerRef} {...innerProps} className={"add-button"}>
                    <img src={"https://cdn-icons-png.flaticon.com/512/32/32339.png"} style={plusStyle}/>
                </div>
            );
        }
        return <components.Option {...props} />;
    };

    return (
        <Select
            styles={selectStyle}
            options={options}
            placeholder="None Selected"
            defaultValue={options[0]}
            onChange={(selectedOption: any) => {
                if (selectedOption.value === "add") {
                    onAdd();
                } else {
                    onOptionSelected(selectedOption.value)
                }
            }}
            components={{ Option: customizeOptions }}
        />

    )
};

const selectStyle: StylesConfig = {
    control: (provided) => ({
        ...provided,
    }),
};

const plusStyle: React.CSSProperties = {
    maxWidth: "1.5em",
    margin: "0px",
    padding: "0px",
}
