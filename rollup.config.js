export default {
    entry: 'index.js',
    dest: 'bundles/ng2-forms-extra.umd.js',
    format: 'umd',
    moduleName: 'ng2frex',
    globals: {
        'rxjs/Observable': 'Rx',
        'rxjs/Subject': 'Rx'
    },
    plugins: [
//    nodeResolve({ jsnext: true, main: true }),
    ]
}
