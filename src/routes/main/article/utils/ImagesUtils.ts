import image from "@/api/models/Image";

export default {

    parse(articleImages:image[], variantImages:image[], variantsLength:number):image[] {
        if (variantsLength > 1)
            return [ ...variantImages, ...articleImages ]
        else if (variantsLength == 1)
            return [ ...articleImages, ...variantImages ]
        else return articleImages
    }

}