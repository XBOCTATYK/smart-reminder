/* Преобразует значения объекта или массива в литеральный тип */
export type InferValueTypes<T> = T extends { [key: string]: infer U }
    ? U
    : T extends Array<infer U>
        ? U
        : never;

/* Преобразует значения массива в литеральный тип */
export type InferValueTypesArray<T> = T extends Array<infer U> ? U : never;
