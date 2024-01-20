export const ContactType = {
    INSTAGRAM: {
        NAME: "Instagram",
        ICON: "pi pi-instagram",
        OPEN: (content) => window.open(content, "_blank")
    },
    FACEBOOK: {
        NAME: "Facebook",
        ICON: "pi pi-facebook",
        OPEN: (content) => window.open(content, "_blank")
    },
    WHATSAPP: {
        NAME: "Whatsapp",
        ICON: "pi pi-whatsapp",
        OPEN: (content) => {
            let mappedContent = content
                .replaceAll('(', '')
                .replaceAll(')', '')
                .replaceAll('.', '')
                .replaceAll('-', '');
            window.open(`https://wa.me/${mappedContent}`, "_blank")
        }
    },
    LINKEDIN: {
        NAME: "Linkedin",
        ICON: "pi pi-linkedin",
        OPEN: (content) => window.open(content, "_blank")
    },
    WEBSITE: {
        NAME: "Website",
        ICON: "pi pi-globe",
        OPEN: (content) => window.open(content, "_blank")
    },
    OTHER: {
        NAME: "Outro",
        ICON: "pi pi-link",
        OPEN: (content) => window.open(content, "_blank")
    }
}
