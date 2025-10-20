export default function({src, className, id}) {

    const imageSrc = src.includes("¬") ? src.split("¬")[0] : src

    return <img src={imageSrc} className={className} id={id} />

}