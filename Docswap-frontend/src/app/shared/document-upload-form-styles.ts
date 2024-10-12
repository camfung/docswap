export const darkModeStyles = {
    input: (provided: any, state: any) => ({
        ...provided,
        color: "#FFF"
    }),
    control: (styles: any) => ({
        ...styles,
        backgroundColor: '#1F1F1F',
        borderColor: '#555',
        borderRadius: '9px',
        color: '#fff',

    }),
    menu: (styles: any) => ({
        ...styles,
        backgroundColor: '#1F1F1F',
        borderRadius: '9px',
    }),

    singleValue: (styles: any) => ({
        ...styles,
        color: '#fff',
    }),
    multiValue: (styles: any) => ({
        ...styles,
        backgroundColor: '#555',
        borderRadius: '12px',
    }),
    multiValueLabel: (styles: any) => ({
        ...styles,
        color: '#fff',
    }),
    multiValueRemove: (styles: any) => ({
        ...styles,
        color: '#fff',
        borderRadius: '3px',
        ':hover': {
            backgroundColor: '#333',
            color: '#fff',
        },
    }),
    option: (styles: any, { isFocused, isSelected }: any) => {
        return {
            ...styles,
            backgroundColor: isSelected ? '#333' : isFocused ? '#555' : '#1F1F1F',
            color: isSelected ? '#FFF' : isFocused ? '#FFF' : '#FFF',
            ':active': {
                backgroundColor: isSelected ? '#333' : '#555',
            },
        };
    }
};

export const lightModeStyles = {
    control: (styles: any) => ({
        ...styles,
        backgroundColor: '#FFF',
        borderColor: '#CCC',
        borderRadius: '9px',
        color: '#000',
    }),
    menu: (styles: any) => ({
        ...styles,
        backgroundColor: '#FFF',
        borderRadius: '9px',
    }),

    singleValue: (styles: any) => ({
        ...styles,
        color: '#000',
    }),

    multiValueLabel: (styles: any) => ({
        ...styles,
        color: '#000',
    }),
    multiValueRemove: (styles: any) => ({
        ...styles,
        color: '#000',
        borderRadius: '3px',
        ':hover': {
            backgroundColor: '#CCC',
            color: '#000',
        },
    }),
    option: (styles: any, { isFocused, isSelected }: any) => {
        return {
            ...styles,
            backgroundColor: isSelected ? '#333' : isFocused ? '#555' : '#FFF',
            color: isSelected ? '#FFF' : isFocused ? '#FFF' : '#000',
            ':active': {
                backgroundColor: isSelected ? '#333' : '#555',
            },
        };
    }
};

