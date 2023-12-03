
export const BackgroundPanelComponent = ({children}) => (
    <div style={style}>
        {children}
    </div>
);

const style = {
    marginLeft: '5%',
    marginRight: '5%',
    width: '90%'
}
