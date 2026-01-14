-- ============================================
-- Teaching Activities Schedule Database Schema
-- ============================================
-- This script creates the database structure for the teaching activities schedule system
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: teaching_activities
-- Stores all teaching activity information
-- ============================================
CREATE TABLE IF NOT EXISTS teaching_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  speaker TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_teaching_activities_start_time ON teaching_activities(start_time);
CREATE INDEX IF NOT EXISTS idx_teaching_activities_speaker ON teaching_activities(speaker);
CREATE INDEX IF NOT EXISTS idx_teaching_activities_title ON teaching_activities(title);

-- ============================================
-- Table: user_roles
-- Manages user roles (admin identification)
-- ============================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- ============================================
-- Function: Check if user is admin
-- ============================================
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on teaching_activities table
ALTER TABLE teaching_activities ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone (including anonymous users) can view activities
CREATE POLICY "Anyone can view teaching activities"
  ON teaching_activities
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert activities
CREATE POLICY "Only admins can insert teaching activities"
  ON teaching_activities
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- Policy: Only admins can update activities
CREATE POLICY "Only admins can update teaching activities"
  ON teaching_activities
  FOR UPDATE
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Policy: Only admins can delete activities
CREATE POLICY "Only admins can delete teaching activities"
  ON teaching_activities
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Enable RLS on user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own role
CREATE POLICY "Users can view their own role"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Only authenticated users can be assigned roles (handled by admin manually)
-- No INSERT/UPDATE/DELETE policies for regular users - roles managed by database admin

-- ============================================
-- Insert 10 Sample Teaching Activities
-- ============================================

INSERT INTO teaching_activities (title, start_time, end_time, location, speaker, description) VALUES
(
  '人工智能基础入门',
  '2026-01-15 09:00:00+00',
  '2026-01-15 11:00:00+00',
  '教学楼A座301室',
  '张教授',
  '本课程介绍人工智能的基本概念、发展历史和应用领域，适合零基础学员。'
),
(
  '机器学习实战工作坊',
  '2026-01-18 14:00:00+00',
  '2026-01-18 17:00:00+00',
  '实验楼B座205室',
  '李博士',
  '通过实际案例学习机器学习算法，包括线性回归、决策树和神经网络等。'
),
(
  'Web开发前端技术讲座',
  '2026-01-20 10:00:00+00',
  '2026-01-20 12:00:00+00',
  '图书馆报告厅',
  '王工程师',
  '深入讲解React、Vue等现代前端框架，以及响应式设计最佳实践。'
),
(
  '数据库设计与优化',
  '2026-01-22 13:30:00+00',
  '2026-01-22 16:30:00+00',
  '教学楼C座102室',
  '陈教授',
  '学习关系型数据库设计原则、SQL优化技巧和索引策略。'
),
(
  '云计算架构设计',
  '2026-01-25 09:00:00+00',
  '2026-01-25 12:00:00+00',
  '在线会议室',
  '刘架构师',
  '探讨云原生应用架构、微服务设计模式和容器化部署方案。'
),
(
  'Python数据分析实践',
  '2026-01-27 14:00:00+00',
  '2026-01-27 16:30:00+00',
  '实验楼A座308室',
  '赵数据科学家',
  '使用Pandas、NumPy和Matplotlib进行数据清洗、分析和可视化。'
),
(
  '网络安全防护技术',
  '2026-01-29 10:00:00+00',
  '2026-01-29 12:00:00+00',
  '教学楼B座401室',
  '孙安全专家',
  '介绍常见网络攻击手段、防护策略和安全审计方法。'
),
(
  '移动应用开发入门',
  '2026-02-01 13:00:00+00',
  '2026-02-01 16:00:00+00',
  '实验楼C座201室',
  '周开发者',
  '学习React Native跨平台开发，快速构建iOS和Android应用。'
),
(
  '敏捷项目管理实践',
  '2026-02-03 09:30:00+00',
  '2026-02-03 11:30:00+00',
  '图书馆会议室',
  '吴项目经理',
  '掌握Scrum框架、看板方法和敏捷团队协作技巧。'
),
(
  '区块链技术与应用',
  '2026-02-05 14:00:00+00',
  '2026-02-05 17:00:00+00',
  '教学楼A座501室',
  '郑研究员',
  '深入理解区块链原理、智能合约开发和去中心化应用构建。'
);

-- ============================================
-- Create an admin user (IMPORTANT)
-- ============================================
-- After running this script, you need to:
-- 1. Sign up a user through your application's auth flow
-- 2. Get the user's UUID from the Supabase Auth dashboard
-- 3. Run the following command to make them an admin:
--
-- INSERT INTO user_roles (user_id, role) VALUES ('YOUR_USER_UUID_HERE', 'admin');
--
-- Replace 'YOUR_USER_UUID_HERE' with the actual UUID from step 2

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify the setup:

-- Check all activities
-- SELECT * FROM teaching_activities ORDER BY start_time;

-- Check user roles
-- SELECT * FROM user_roles;

-- Test RLS policies (as anonymous user)
-- SELECT * FROM teaching_activities; -- Should work
-- INSERT INTO teaching_activities (title, start_time, end_time, location, speaker) 
--   VALUES ('Test', NOW(), NOW(), 'Test', 'Test'); -- Should fail for non-admin
