import {ThemeData} from "@/app/utils/utils";
import Select, { components, StylesConfig } from "react-select";

export const theme_selector = ({
                         themes,
                         onThemeSelected,
                     }: {
    themes: ThemeData[],
    onThemeSelected: (selectedTheme: string) => void,
}) => {
    const options = themes.map((theme) => ({
        value: theme.id,
        label: theme.nameTheme,
    }));
    options.push({ value: "add", label: "+" })

    const onAddTheme = () => {
        // TODO : Ask the API to generate a new theme
        // TODO : Wait for the API to create the theme then call onThemeSelected
        // TODO : Visual cues for when the API is loading the thingy
        console.log("Adding a new theme !")
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
                    onAddTheme();
                } else {
                    onThemeSelected(selectedOption.value)
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
