import { supabase } from "../lib/supabase";


type Project = {
    id: number;
    content: string;
    date: string;
    password: string;
};

// Supabase에서 데이터 가져오기
const fetchPost = async (setProjects: React.Dispatch<React.SetStateAction<Project[] | null>>) => {
        const { data, error } = await supabase
        .from('portfolio')
        .select('id, created_at, content, password');

        if (error) {
            console.error('데이터 가져오기 실패', error);
        }
        else {
            const mappedData = data?.map((item: any) => ({
                id: item.id,
                content: item.content,
                date: item.created_at,
                password: item.password
            })) || [];
            setProjects(mappedData);
            console.log('패치완료');
        }
    };

// Supabase에 데이터 추가하는 함수
const addPost = async (content: string, password: string) => {
    const { data, error } = await supabase
        .from("portfolio")
        .insert([{ content, password }]);

    if (error) {
        console.error('글 작성 실패', error);
        return { success: false };
    }

    return { success: true, data };
};

// Supabase에서 데이터 삭제하는 함수
const deletePost = async (id: number) => {
    const { data, error } = await supabase
        .from("portfolio")
        .delete()
        .eq("id", id);

    if (error) {
        console.error('글 삭제 실패', error);
        return { success: false };
    }

    return { success: true, data };
};

// Supabase에서 데이터 업데이트하는 함수
const updatePost = async (id: number, content: string, password: string) => {
    const { data, error } = await supabase
        .from("portfolio")
        .update({ content, password })
        .eq("id", id);

    if (error) {
        console.error('업데이트 실패', error);
        return { success: false };
    }

    return { success: true, data };
};

export { fetchPost, addPost, deletePost, updatePost };
