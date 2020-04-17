export type PostmanEventListen = "test" | "prerequest";

export type PostmanEventTest<T> = {
    func: T;
    listen: PostmanEventListen;
}

export type PostmanPathTest = PostmanEventTest<string>;

export type PostmanFuncTest = PostmanEventTest<Function>;

export type PostmanPremadeTest = PostmanEventTest<string[]>;


export type PostmanTest = {
    paths?: Array<PostmanPathTest>;
    funcs?: Array<PostmanFuncTest>;
    premades?: Array<PostmanPremadeTest>;
}