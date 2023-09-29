export const PaddingStyle = {
    makePadding: (pl, pt, pr, pb) => (
        (pl && !pt && !pr && !pb)
            ? { padding: pl }
            : {
                paddingLeft: pl,
                paddingTop: pt,
                paddingRight: pr,
                paddingBottom: pb,
            }
    )
}