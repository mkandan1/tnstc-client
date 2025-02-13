export const getId = () => {
    const url = window.location.href;
    const segments = url.split("/");
    return segments[segments.length - 1];
};

export default {
    getId
}