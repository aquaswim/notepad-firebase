export const getCurrentDocID = () => {
    const path = window.location.pathname;
    return path.split('/').pop();
}
