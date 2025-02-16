import Select, {StylesConfig} from "react-select";
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
    // Simplified selector without the "+" option
    return (
        <Select
            styles={selectStyle}
            options={options}
            placeholder="None Selected"
            defaultValue={options[0]}
            onChange={(selectedOption: any) => {
                onOptionSelected(selectedOption.value);
            }}
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
