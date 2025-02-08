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
        let request: string | null = "";
        switch (apiToUse) {
            case APIS.Language:
                request = prompt("Insérez la langue à ajouter")
                console.log("Adding the language : " + request)
                break;
            case APIS.Theme:
                request = prompt("Insérez le thème à ajouter")
                console.log("Adding the theme : " + request)
                break;
        }
        // TODO : Wait for the API to create the option then call onThemeSelected
    }

    const customizeOptions = (props: any) => {
        const { data, innerRef, innerProps } = props;

        if (data.value === "add") {
            return (
                <div ref={innerRef} {...innerProps} className={"add-button"} style={buttonStyle}>
                    <img src={"https://cdn-icons-png.flaticon.com/512/32/32339.png"} style={plusImgStyle}/>
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
        marginTop: "10px",
        marginBottom: "10px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        width: "80%",
        margin: "10px auto 10px auto",
    }),
    menu: (provided) => ({
        ...provided,
        width: "80%",
        margin: "0 10%",
    }),
};

const buttonStyle: React.CSSProperties = {
    width: "98%",
}

const plusImgStyle: React.CSSProperties = {
    maxWidth: "1.5em",
    margin: "0px",
    padding: "0px",
}