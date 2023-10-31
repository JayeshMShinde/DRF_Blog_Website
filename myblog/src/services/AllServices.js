import axiosInstance from "../utils/axiosInstance";

const baseUrl = "http://127.0.0.1:8000/"

export const get_register_user = async () => {
    try {
        let resp = await axiosInstance.get(baseUrl + "api/register/")

        return resp.data;
    }
    catch (err) {
        console.log(err);
    }
}

export const Add_comment = async (data) => {
    try {
        let resp = await axiosInstance.post(baseUrl + "api/comment/", data)
        if (resp.status === 201) {
            alert("Comment added successfully");
        }
        else {
            alert("Failed to add comment");
        }
        return resp.data;
    }

    catch (error) {
        console.log("Error in adding comment");
    }
}

export const likePost = async (postId, action) => {
    try {
        const response = await axiosInstance.post(baseUrl + `api/blog-like/${postId}/`, {
            action: action,
        });
        return response;
    } catch (error) {
        console.error("Error while liking/disliking the post", error);
    }
};

export const FollowUser = async (id) => {
    try {

        const response = await axiosInstance.post(baseUrl + `api/user/${id}/follow/`);
        if (response.status === 201) {
            alert('Followed Successfully');
        }
        else {
            alert('Unable To follow')
        }
    }
    catch (error) {
        console.error('Follow user failed', error);
    }
};

export const UnFollowUser = async (id, data) => {
    try {
        const response = await axiosInstance.delete(baseUrl + `api/user/${id}/unfollow/`, data);
        if (response.status === 201) {
            alert('Unfollowed Successfully');
            // return response;
        }
    }
    catch (error) {
        console.error('Follow user failed', error);
    }
};

export const GetUserbyid = async (id) => {
    try {
        const resp = await axiosInstance.get(baseUrl + `api/profile/${id}/`);
        return resp.data;
    }
    catch (err) {
        console.log('Failed to get profile info', err);
    }
};

export const getUserProfile = async () => {
    try {
        let res = await axiosInstance.get(`${baseUrl}api/profile/`);
        return res.data;
    }
    catch (e) {
        console.log('Failed to fetch user profile', e);
    }
}

export const addUser = async (data) => {
    try {
        const resp = await axiosInstance.post(baseUrl + 'api/profile/', data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (resp.status === 201) {
            alert('Profile Created successfully');
        }
    } catch (err) {
        console.log('Failed to create profile', err);
    }
};

export const updateUser = async (id, data) => {
    try {
        const resp = await axiosInstance.put(baseUrl + `api/profile/${id}/`, data);
        if (resp.status === 200) {
            alert('Profile Updated successfully');
        }
    } catch (err) {
        console.log('Failed to update profile', err);
    }
};

export const check_IfUserIsFollowingAuthor = async (followData) => {
    try {
        const res = await axiosInstance.get(`${baseUrl}api/blog/${followData.user_id}/following`);

        if (res.status === 200) {
            return res.data.is_following;
        }
    } catch (error) {
        console.error('Failed to check if user is following or not', error);
        return false;
    }
};

export const deletePost = async (slug) => {
    try {
        const response = await axiosInstance.delete(baseUrl + 'api/post/' + slug + '/')
        if (response.status === 204) {
            alert('Blog Deleted Successfully!')
        }
    }
    catch (err) {
        console.log('Failed to Delete Blog', err)
    }
};

export const getBlogBySlug = async (slug) => {
    try {
        const resp = await axiosInstance.get(`${baseUrl}api/post/${slug}`);
        if (resp.status === 200) {
            return resp.data;
        }
    }
    catch (err) {
        console.log('Failed to fetch blog by Slug', err);
    }
}