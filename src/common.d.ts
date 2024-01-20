// 懒得每个类型都定义了，所有都定义为Obj
type Obj<T extends Obj = Obj> = Record<string, any> & T;

type ApiReturn<T> = Promise<{
    code: number;
    msg: string;

    data?: T;
    permissions?: string[];
    roles?: string[];
    user?: Obj;
}>;

type ApiPageReturn<T> = Promise<{
    code: number;
    msg: string;
    rows: T[];
    total: number;
}>;

type PageApi = (params: Obj) => ApiPageReturn;
