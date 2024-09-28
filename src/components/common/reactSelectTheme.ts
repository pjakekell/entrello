import colors from "../../utils/colors";

export const selectTheme = (theme: any) => ({
    ...theme,
    borderRadius: 3,
    colors: {
        ...theme.colors,
        primary: colors.orange[500],
    },
});

export const customSelectStyles = {
    control: (provided: any) => ({
        ...provided,
        minHeight: "32px",
    }),
    indicatorsContainer: (provided: any) => ({
        ...provided,
        "> div": {
            padding: "6px",
        },
    }),
};