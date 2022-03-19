import {ParameterMetadata} from '../decorators/parameters';

export function buildBody(bodyMetadata: ParameterMetadata[], plainBodyMetadata: ParameterMetadata[]) {

    const metadata = bodyMetadata || plainBodyMetadata;
    const plain = plainBodyMetadata && plainBodyMetadata.length > 0;

    if (!metadata) {
        return undefined;
    }

    if (metadata.length > 1) {
        throw new Error('Only one @Body is allowed');
    }

    const value = metadata[0] ? metadata[0].value : undefined;

    return plain ? value : JSON.stringify(value);
}
