export const testData = {
    metadata: {
        createTime: null,
        lastEditTime: null,
        desc: '',
        status: 'EDITSTATUS',
        dagOrigId: 721,
        dagInsId: 10966,
        name: '流量短时预测',
        kv: {
            numExecutors: '1',
            sparkJobProgress: '{"isShow":false,"jobId":-1,"succeeded":0,"total":0}',
            driverMemory: '15g',
            executorMemory: '1g',
            dagBackendId: 10966,
            driverCores: '1',
            executorCores: '1',
            conf: '',
            timeProgress: '{"startTime":"2021-01-16 14:20:26","currentTime":"2021-01-16 14:21:50"}'
        },
        id: 721
    },
    components: [
        {
            id: 16148436484728,
            name: 'Shell任务-0',
            description: '',
            status: 'READY',
            classname: 'Shell任务',
            position: { x: 185, y: 269 },
            parents: [],
            children: [{ 0: '16148436517690-0' }],
            compId: 2,
            isParamValid: true,
            isExecutable: true,
            canExecuteFromThisNode: true,
            canExecuteToThisNode: false,
            runStatus: '准备执行'
        },
        {
            id: 16148436517690,
            name: 'Python任务-0',
            description: '',
            status: 'READY',
            classname: 'Python任务',
            position: { x: 158, y: 382 },
            parents: [{ 0: '16148436484728-0' }],
            children: [],
            compId: 1,
            isParamValid: true,
            isExecutable: false,
            canExecuteFromThisNode: false,
            canExecuteToThisNode: true,
            runStatus: '准备执行'
        }
    ]
}

export const classInfomation = [
    {
        id: 16,
        name: 'Python任务',
        image: 'dataedit.png',
        url: 'dataedit.png',
        description: 'Python任务',
        clazz: 'org.apache.spark.ml.awaken.platform.component.ml.io.datasource.transformers.IOOutputTransformer',
        version: null,
        compId: 1,
        paramType: 'IO',
        clipType: 'DATASOURCE',
        parentId: 8,
        isParent: '0',
        componentContentId: 1,
        input: [{ name: 'data', type: 'data', image: null, index: '0', description: '输入数据', typeId: 2 }],
        output: [{ name: 'data', type: 'data', image: null, index: '0', description: '输出数据', typeId: 2 }]
    },
    {
        id: 17,
        name: 'Shell任务',
        image: 'datainout.png',
        url: 'datainout.png',
        description: 'Shell任务',
        clazz: 'org.apache.spark.ml.awaken.platform.component.ml.io.datasource.transformers.IOInputTransformer',
        version: null,
        compId: 2,
        paramType: 'IO',
        clipType: 'DATASOURCE',
        parentId: 8,
        isParent: '0',
        componentContentId: 2,
        input: [],
        output: [{ name: 'data', type: 'data', image: null, index: '0', description: '输出数据', typeId: 2 }]
    }
]
