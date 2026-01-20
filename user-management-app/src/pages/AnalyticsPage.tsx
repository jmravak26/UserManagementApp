import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { UserRole, UserStatus } from '../types/User';
import './AnalyticsPage.css';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { items } = useAppSelector((s) => s.users);

  // Calculate role distribution
  const roleStats = useMemo(() => {
    const stats = { [UserRole.ADMIN]: 0, [UserRole.MANAGER]: 0, [UserRole.USER]: 0 };
    items.forEach(user => stats[user.role]++);
    const total = items.length || 1;
    return Object.entries(stats).map(([role, count]) => ({
      role,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }, [items]);

  // Calculate status distribution
  const statusStats = useMemo(() => {
    const active = items.filter(u => u.status === UserStatus.ACTIVE).length;
    const inactive = items.filter(u => u.status === UserStatus.INACTIVE).length;
    const total = items.length || 1;
    return {
      active,
      inactive,
      activePercentage: Math.round((active / total) * 100),
      inactivePercentage: Math.round((inactive / total) * 100)
    };
  }, [items]);

  // Calculate registration trends (group by month)
  const registrationTrends = useMemo(() => {
    const last6Months: string[] = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      last6Months.push(key);
    }

    const monthCounts: Record<string, number> = {};
    last6Months.forEach(month => monthCounts[month] = 0);
    
    items.forEach(user => {
      if (user.birthDate) {
        const [, month, year] = user.birthDate.split('/');
        const key = `${year}-${month}`;
        if (last6Months.includes(key)) {
          monthCounts[key]++;
        }
      }
    });

    const maxCount = Math.max(...Object.values(monthCounts), 1);
    
    return last6Months.map(key => ({
      month: key,
      count: monthCounts[key],
      height: (monthCounts[key] / maxCount) * 100
    }));
  }, [items]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    // Calculate growth: compare last 2 months in the chart
    let recentGrowth = 0;
    let growthLabel = 'No data';
    
    if (registrationTrends.length >= 2) {
      const lastMonth = registrationTrends[registrationTrends.length - 1];
      const prevMonth = registrationTrends[registrationTrends.length - 2];
      recentGrowth = lastMonth.count - prevMonth.count;
      growthLabel = `${prevMonth.month} (${prevMonth.count}) → ${lastMonth.month} (${lastMonth.count})`;
    } else if (registrationTrends.length === 1) {
      recentGrowth = registrationTrends[0].count;
      growthLabel = `First month: ${registrationTrends[0].month}`;
    }
    
    return {
      totalUsers: items.length,
      activeUsers: statusStats.active,
      adminCount: roleStats.find(r => r.role === UserRole.ADMIN)?.count || 0,
      recentGrowth,
      growthLabel
    };
  }, [items.length, statusStats.active, roleStats, registrationTrends]);

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h2>📊 User Analytics Dashboard</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/users')}>
          ← Back to Users
        </button>
      </header>

      {/* Key Metrics Cards */}
      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{metrics.totalUsers}</div>
          <div className="metric-label">Total Users</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.activeUsers}</div>
          <div className="metric-label">Active Users</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.adminCount}</div>
          <div className="metric-label">Administrators</div>
        </div>
        <div className="metric-card" title={metrics.growthLabel}>
          <div className="metric-value" style={{ color: metrics.recentGrowth > 0 ? '#10b981' : metrics.recentGrowth < 0 ? '#ef4444' : '#3b82f6' }}>
            {metrics.recentGrowth > 0 ? '+' : ''}{metrics.recentGrowth}
          </div>
          <div className="metric-label">Month-to-Month Growth</div>
          {registrationTrends.length >= 2 && (
            <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              {registrationTrends[registrationTrends.length-2].count} → {registrationTrends[registrationTrends.length-1].count}
            </div>
          )}
        </div>
      </section>

      <div className="charts-container">
        {/* Role Distribution Chart */}
        <section className="chart-section">
          <h3>Role Distribution</h3>
          <div className="pie-chart">
            {roleStats.map((stat) => (
              <div key={stat.role} className="pie-segment" style={{ '--percentage': stat.percentage } as React.CSSProperties}>
                <div className="pie-label">
                  <span className={`role-badge role-${stat.role.toLowerCase()}`}>{stat.role}</span>
                  <span className="pie-value">{stat.count} ({stat.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Registration Trends Chart */}
        <section className="chart-section">
          <h3>Registration Trends (Last 6 Months)</h3>
          <div className="bar-chart">
            {registrationTrends.length > 0 ? (
              registrationTrends.map((trend) => (
                <div key={trend.month} className="bar-item">
                  <div className="bar" style={{ height: `${trend.height}%` }}>
                    <span className="bar-value">{trend.count}</span>
                  </div>
                  <div className="bar-label">{trend.month}</div>
                </div>
              ))
            ) : (
              <div className="empty-chart">No registration data available</div>
            )}
          </div>
        </section>

        {/* Activity Status Chart */}
        <section className="chart-section">
          <h3>User Activity Status</h3>
          <div className="status-chart">
            <div className="status-bar">
              <div 
                className="status-segment active" 
                style={{ width: `${statusStats.activePercentage}%` }}
                title={`Active: ${statusStats.active} users`}
              >
                {statusStats.activePercentage > 15 && `${statusStats.activePercentage}%`}
              </div>
              <div 
                className="status-segment inactive" 
                style={{ width: `${statusStats.inactivePercentage}%` }}
                title={`Inactive: ${statusStats.inactive} users`}
              >
                {statusStats.inactivePercentage > 15 && `${statusStats.inactivePercentage}%`}
              </div>
            </div>
            <div className="status-legend">
              <div className="legend-item">
                <span className="legend-color active"></span>
                <span>Active: {statusStats.active} ({statusStats.activePercentage}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color inactive"></span>
                <span>Inactive: {statusStats.inactive} ({statusStats.inactivePercentage}%)</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage;
