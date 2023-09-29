import {BreadCrumb} from 'primereact/breadcrumb';


export const BreadcrumbComponent = ({passos= []}) => (
    <BreadCrumb model={generatePassos(passos)} home={{icon: 'pi pi-home', disabled: true}}/>
)

function generatePassos(passos) {
    if(passos.length === 0){
        return null
    }
    return passos.map(passo => ({label: passo, disabled: true}))
}