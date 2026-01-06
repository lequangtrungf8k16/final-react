export type TUser = {
    name: string;
};

export interface IUser {
    name: string;
}

export const getUser = (a:string, v:string) => {
    console.log(a, v);
    
    return "OK";
};
