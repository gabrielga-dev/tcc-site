import {ColorConstants} from "../style/color.constants";

export const BreadcrumbComponent = ({passos = []}) => (
    <div style={BREADCRUMB_STYLE}>
        {generatePassos(passos)}
    </div>
);

const BREADCRUMB_STYLE = {
    backgroundColor: ColorConstants.BACKGROUND.AUX,
    borderColor: ColorConstants.BACKGROUND.AUX,
    color: ColorConstants.TEXT_COLOR_MAIN,
    width: '100%',
    borderRadius: 5,
    padding: 10
}

function generatePassos(passos) {
    if (passos.length === 0) {
        return null
    }
    return passos.map(
        (passo, index) => (
            <span key={passo}>{passo} {index !== passos.length - 1 && <span> &gt; </span>}</span>
        )
    );
}
