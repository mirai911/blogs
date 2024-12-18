'use client'
import React, { useState } from 'react';
import { Layout, Typography, Space, List, Divider, Spin, message, Button, Form, Input, Statistic } from 'antd';
import { Book, Bell, User, Plus, FileText, BookOpen } from 'lucide-react';
import usePosts, { PostsContext } from '../hooks/usePosts';
import usePost from '../hooks/usePost';
import useCreatePost from '../hooks/useCreatePost';
import useSavePost from '../hooks/useSavePost';
import useDeletePost from '../hooks/useDeletePost';

const { Header, Content, Sider } = Layout;
const { Title, Paragraph, Text, Link } = Typography;
const { TextArea } = Input;

export default function App() {
  const [activePostId, setActivePostId] = useState();

  return (
    <PostsContext>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            <Space align="center" size={16}>
              <div style={{ 
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src="https://creditdharma.in/_next/image/?url=%2FlogoText.png&w=1920&q=75" 
                  alt="Credit Dharma Logo" 
                  style={{ height: '24px' }}
                />
              </div>
            </Space>
            <Space>
              <Button type="text" icon={<Bell size={16} />} />
              <Button type="text" icon={<User size={16} />} />
              <Button type="primary" icon={<Plus size={16} />}>New Post</Button>
            </Space>
          </div>
        </Header>
        <Layout>
          <Sider width={200} theme="light" style={{ background: '#fff' }}>
            <div style={{ padding: '16px' }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Button 
                  type="text" 
                  icon={<BookOpen size={16} />}
                  onClick={() => setActivePostId(undefined)}
                  style={{ textAlign: 'left', paddingLeft: 0 }}
                >
                  All Posts
                </Button>
                <div>
                  <Stats />
                </div>
              </Space>
            </div>
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: '#fff',
              }}
            >
              {activePostId ? (
                <Post
                  activePostId={activePostId}
                  setActivePostId={setActivePostId}
                />
              ) : (
                <Posts setActivePostId={setActivePostId} />
              )}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </PostsContext>
  );
}

function Posts({ setActivePostId }) {
  const { status, posts, error, refetch } = usePosts();
  const [createPost, createPostStatus] = useCreatePost();

  const onSubmit = async (values) => {
    try {
      await createPost(values);
      refetch();
      message.success('Post created successfully!');
    } catch (err) {
      console.error(err);
      message.error('Failed to create post');
    }
  };

  if (status === 'loading') return <Spin size="large" />;
  if (status === 'error') return <Text type="danger">Error: {error.message}</Text>;

  return (
    <>
      <List
        header={<Title level={4}>Posts</Title>}
        bordered
        dataSource={posts}
        renderItem={(post) => (
          <List.Item>
            <Link onClick={() => setActivePostId(post.id)}>
              {post.title}
            </Link>
          </List.Item>
        )}
      />
      <Divider />
      <Title level={4}>Create New Post</Title>
      <PostForm
        onSubmit={onSubmit}
        submitText={
          createPostStatus === 'loading'
            ? 'Saving...'
            : createPostStatus === 'error'
            ? 'Error!'
            : createPostStatus === 'success'
            ? 'Saved!'
            : 'Create Post'
        }
      />
    </>
  );
}

function Post({ activePostId, setActivePostId }) {
  const { status, post, error, refetch } = usePost(activePostId);
  const [savePost, savePostStatus] = useSavePost();
  const [deletePost, deletePostStatus] = useDeletePost();

  const onSubmit = async (values) => {
    try {
      await savePost(values);
      refetch();
      message.success('Post updated successfully!');
    } catch (err) {
      console.error(err);
      message.error('Failed to update post');
    }
  };

  const onDelete = async () => {
    if (post?.id) {
      try {
        await deletePost(post.id);
        setActivePostId();
        message.success('Post deleted successfully!');
      } catch (err) {
        console.error(err);
        message.error('Failed to delete post');
      }
    }
  };

  if (status === 'loading') return <Spin size="large" />;
  if (status === 'error') return <Text type="danger">Error: {error.message}</Text>;

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Title level={2}>{post.title}</Title>
      <Paragraph>{post.content}</Paragraph>
      <Divider />
      <Title level={4}>Edit Post</Title>
      <PostForm
        initialValues={post}
        onSubmit={onSubmit}
        submitText={
          savePostStatus === 'loading'
            ? 'Saving...'
            : savePostStatus === 'error'
            ? 'Error!'
            : savePostStatus === 'success'
            ? 'Saved!'
            : 'Update Post'
        }
      />
      <Button danger onClick={onDelete} loading={deletePostStatus === 'loading'}>
        Delete Post
      </Button>
    </Space>
  );
}

function PostForm({ initialValues, onSubmit, submitText }) {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onSubmit(values);
    if (!initialValues) {
      form.resetFields();
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please input the title!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="content"
        label="Content"
        rules={[{ required: true, message: 'Please input the content!' }]}
      >
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
}

function Stats() {
  const { posts, status } = usePosts();
  
  return (
    <Statistic
      title="Total Posts"
      value={status === 'loading' ? <Spin size="small" /> : posts.length}
      prefix={<FileText size={16} />}
    />
  );
}

