import * as helpers from '../../helpers'
export default function mockConfigFetcher( paths: string[] ) {
    jest.spyOn(helpers, 'getAuroraConfigJSON').mockImplementation(async () => {
        return {
            'files': paths.map( path => `src/tests/schemas/${path}`),
            'output': './generated.prisma'
        } 
    })

    jest.spyOn(helpers, 'writeSchema').mockImplementation(async (output, schema) => {})
}