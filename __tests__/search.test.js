import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/app/page';
import { createClient } from '@/lib/supabase/client';

// Mock Supabase client
jest.mock('@/lib/supabase/client');

const mockActivities = [
    {
        id: '1',
        title: '人工智能基础入门',
        start_time: '2026-01-15T09:00:00Z',
        end_time: '2026-01-15T11:00:00Z',
        location: '教学楼A座301室',
        speaker: '张教授',
        description: '本课程介绍人工智能的基本概念',
    },
    {
        id: '2',
        title: '机器学习实战工作坊',
        start_time: '2026-01-18T14:00:00Z',
        end_time: '2026-01-18T17:00:00Z',
        location: '实验楼B座205室',
        speaker: '李博士',
        description: '通过实际案例学习机器学习算法',
    },
    {
        id: '3',
        title: 'Web开发前端技术讲座',
        start_time: '2026-01-20T10:00:00Z',
        end_time: '2026-01-20T12:00:00Z',
        location: '图书馆报告厅',
        speaker: '王工程师',
        description: '深入讲解React、Vue等现代前端框架',
    },
];

describe('Search and Filter Functionality', () => {
    beforeEach(() => {
        // Mock Supabase query
        const mockFrom = jest.fn(() => ({
            select: jest.fn(() => ({
                order: jest.fn(() => ({
                    data: mockActivities,
                    error: null,
                })),
            })),
        }));

        createClient.mockReturnValue({
            from: mockFrom,
        });
    });

    test('should display all activities initially', async () => {
        render(<HomePage />);

        await waitFor(() => {
            expect(screen.getByText('人工智能基础入门')).toBeInTheDocument();
            expect(screen.getByText('机器学习实战工作坊')).toBeInTheDocument();
            expect(screen.getByText('Web开发前端技术讲座')).toBeInTheDocument();
        });
    });

    test('should filter activities by title', async () => {
        render(<HomePage />);

        await waitFor(() => {
            expect(screen.getByText('人工智能基础入门')).toBeInTheDocument();
        });

        const titleInput = screen.getByPlaceholderText('搜索活动标题...');
        fireEvent.change(titleInput, { target: { value: '人工智能' } });

        await waitFor(() => {
            expect(screen.getByText('人工智能基础入门')).toBeInTheDocument();
            expect(screen.queryByText('机器学习实战工作坊')).not.toBeInTheDocument();
            expect(screen.queryByText('Web开发前端技术讲座')).not.toBeInTheDocument();
        });
    });

    test('should filter activities by speaker', async () => {
        render(<HomePage />);

        await waitFor(() => {
            expect(screen.getByText('人工智能基础入门')).toBeInTheDocument();
        });

        const speakerInput = screen.getByPlaceholderText('搜索演讲者...');
        fireEvent.change(speakerInput, { target: { value: '李博士' } });

        await waitFor(() => {
            expect(screen.queryByText('人工智能基础入门')).not.toBeInTheDocument();
            expect(screen.getByText('机器学习实战工作坊')).toBeInTheDocument();
            expect(screen.queryByText('Web开发前端技术讲座')).not.toBeInTheDocument();
        });
    });

    test('should filter activities by date range', async () => {
        render(<HomePage />);

        await waitFor(() => {
            expect(screen.getByText('人工智能基础入门')).toBeInTheDocument();
        });

        const startDateInput = screen.getByLabelText('开始日期');
        const endDateInput = screen.getByLabelText('结束日期');

        fireEvent.change(startDateInput, { target: { value: '2026-01-16' } });
        fireEvent.change(endDateInput, { target: { value: '2026-01-19' } });

        await waitFor(() => {
            expect(screen.queryByText('人工智能基础入门')).not.toBeInTheDocument();
            expect(screen.getByText('机器学习实战工作坊')).toBeInTheDocument();
            expect(screen.queryByText('Web开发前端技术讲座')).not.toBeInTheDocument();
        });
    });

    test('should reset filters when reset button is clicked', async () => {
        render(<HomePage />);

        await waitFor(() => {
            expect(screen.getByText('人工智能基础入门')).toBeInTheDocument();
        });

        // Apply filters
        const titleInput = screen.getByPlaceholderText('搜索活动标题...');
        fireEvent.change(titleInput, { target: { value: '人工智能' } });

        await waitFor(() => {
            expect(screen.queryByText('机器学习实战工作坊')).not.toBeInTheDocument();
        });

        // Reset filters
        const resetButton = screen.getByText('重置筛选');
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(screen.getByText('人工智能基础入门')).toBeInTheDocument();
            expect(screen.getByText('机器学习实战工作坊')).toBeInTheDocument();
            expect(screen.getByText('Web开发前端技术讲座')).toBeInTheDocument();
        });
    });

    test('should show "no results" message when no activities match filters', async () => {
        render(<HomePage />);

        await waitFor(() => {
            expect(screen.getByText('人工智能基础入门')).toBeInTheDocument();
        });

        const titleInput = screen.getByPlaceholderText('搜索活动标题...');
        fireEvent.change(titleInput, { target: { value: '不存在的活动' } });

        await waitFor(() => {
            expect(screen.getByText(/没有找到符合条件的活动/)).toBeInTheDocument();
        });
    });
});
