const Application = require('../models/Application');
const Claim = require('../models/Claim');
const User = require('../models/User');

// GET /api/admin/stats
// Admin only
const getStats = async (req, res) => {
  try {
    // 1. Total policies sold (approved applications)
    const totalPoliciesSold = await Application.countDocuments({ status: 'approved' });

    // 2. Total customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // 3. Claims breakdown
    const [claimsApproved, claimsRejected] = await Promise.all([
      Claim.countDocuments({ status: 'approved' }),
      Claim.countDocuments({ status: 'rejected' }),
    ]);

    // 4. Monthly revenue trend — last 6 months
    // Join approved applications with their policy to get the premium, group by month
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const revenueByMonth = await Application.aggregate([
      {
        $match: {
          status: 'approved',
          decidedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $lookup: {
          from: 'policies',
          localField: 'policy',
          foreignField: '_id',
          as: 'policyDetails',
        },
      },
      { $unwind: '$policyDetails' },
      {
        $group: {
          _id: {
            year: { $year: '$decidedAt' },
            month: { $month: '$decidedAt' },
          },
          revenue: { $sum: '$policyDetails.premium' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          revenue: 1,
          count: 1,
        },
      },
    ]);

    // Fill in any months with zero revenue so the chart always has 6 points
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trend = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - 5 + i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1; // 1-indexed
      const found = revenueByMonth.find((r) => r.year === y && r.month === m);
      trend.push({
        label: `${monthNames[m - 1]} ${y}`,
        revenue: found ? found.revenue : 0,
        count: found ? found.count : 0,
      });
    }

    res.json({
      totalPoliciesSold,
      totalCustomers,
      claimsApproved,
      claimsRejected,
      revenueByMonth: trend,
    });
  } catch (err) {
    console.error('Admin stats error:', err.message);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

module.exports = { getStats };
