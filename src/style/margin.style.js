export const MarginStyle = {
    makeMargin: (ml, mt, mr, mb) => (
        (ml && !mt && !mr && !mb)
            ? { margin: ml }
            : {
                marginLeft: ml,
                marginTop: mt,
                marginRight: mr,
                marginBottom: mb,
            }
    )
}