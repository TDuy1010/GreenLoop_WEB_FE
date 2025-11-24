import React, { useEffect, useMemo, useState } from 'react';
import { Button, Empty, message, Tag } from 'antd';
import { GiftOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  getRedeemableCampaigns,
  getCampaignVouchersPublic,
  redeemVoucher,
} from '../../../../service/api/voucherApi';
import { formatDateVN } from '../../../../utils/dateUtils';

const normalizeCampaigns = (response) => {
  if (!response) return [];
  const payload = response?.content
    ? response
    : response?.data?.content
      ? response.data
      : response?.data
        ? response.data
        : response;

  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload)) return payload;
  return [];
};

const normalizeVouchers = normalizeCampaigns;

const deriveTransactionMeta = (tx = {}) => {
  const description = tx?.description || tx?.action || 'Giao dịch điểm';
  const actionType = (tx?.type || tx?.actionType || tx?.action || '').toUpperCase();
  const numericPoints = Number(tx?.points ?? tx?.point ?? tx?.pointChanged ?? tx?.amount ?? 0) || 0;
  const isSpend =
    actionType.includes('SPEND') || actionType.includes('REDEEM') || actionType.includes('USE');
  const absPoints = Math.abs(numericPoints);
  const timestamp = tx?.createdAt ? new Date(tx.createdAt).getTime() : null;
  return { description, actionType, numericPoints, absPoints, isSpend, timestamp };
};

const groupTransactions = (list = []) => {
  const groupMap = new Map();
  list.forEach((tx, index) => {
    const meta = deriveTransactionMeta(tx);
    const key = `${meta.description}|${meta.actionType}|${meta.isSpend}|${meta.absPoints}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        meta,
        count: 0,
        latestTimestamp: meta.timestamp ?? 0,
        latestTx: tx,
        firstIndex: index,
      });
    }
    const group = groupMap.get(key);
    group.count += 1;
    if ((meta.timestamp ?? 0) > group.latestTimestamp) {
      group.latestTimestamp = meta.timestamp ?? 0;
      group.latestTx = tx;
    }
  });
  return Array.from(groupMap.values()).sort((a, b) => {
    if (b.latestTimestamp === a.latestTimestamp) {
      return a.firstIndex - b.firstIndex;
    }
    return b.latestTimestamp - a.latestTimestamp;
  });
};

const RedeemVoucherTab = ({
  ecoPoints = 0,
  ecoPointLoading = false,
  ecoPointError = null,
  lifetimePoints = 0,
  transactions = [],
  ownedVouchers = [],
  onRedeemSuccess,
}) => {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignError, setCampaignError] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [redeemingId, setRedeemingId] = useState(null);

  const fetchCampaigns = async () => {
    try {
      setCampaignLoading(true);
      setCampaignError(null);
      const response = await getRedeemableCampaigns({ page: 0, size: 20 });
      const list = normalizeCampaigns(response);
      setCampaigns(list);
      if (!selectedCampaign && list.length > 0) {
        selectCampaign(list[0]);
      }
    } catch (error) {
      console.error('Không thể tải chiến dịch:', error);
      setCampaignError(error?.message || 'Không thể tải danh sách chiến dịch.');
      setCampaigns([]);
    } finally {
      setCampaignLoading(false);
    }
  };

  const selectCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    if (campaign?.campaignId || campaign?.id) {
      fetchVouchers(campaign.campaignId || campaign.id);
    } else {
      setVouchers([]);
    }
  };

  const fetchVouchers = async (campaignId) => {
    if (!campaignId) return;
    try {
      setVoucherLoading(true);
      const response = await getCampaignVouchersPublic(campaignId);
      const list = normalizeVouchers(response);
      setVouchers(list);
    } catch (error) {
      console.error('Không thể tải voucher của chiến dịch:', error);
      message.error(error?.message || 'Không thể tải voucher của chiến dịch này');
      setVouchers([]);
    } finally {
      setVoucherLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availablePoints = Number.isFinite(ecoPoints) ? ecoPoints : 0;

  const handleRedeem = async (voucher) => {
    if (!voucher) return;
    const requiredPoints = voucher.pointToRedeem || 0;
    if (availablePoints < requiredPoints) {
      message.warning('Bạn không đủ điểm Eco để đổi voucher này');
      return;
    }

    try {
      setRedeemingId(voucher.voucherId || voucher.id);
      const response = await redeemVoucher(voucher.voucherId || voucher.id);
      message.success('Đổi voucher thành công!');
      const remainingPoints =
        response?.data?.remainingPoints ??
        response?.data?.ecoPoints ??
        response?.remainingPoints ??
        null;
      onRedeemSuccess?.({
        remainingPoints,
        spentPoints: requiredPoints,
      });
      if (selectedCampaign?.campaignId || selectedCampaign?.id) {
        fetchVouchers(selectedCampaign.campaignId || selectedCampaign.id);
      }
    } catch (error) {
      console.error('Không thể đổi voucher:', error);
      message.error(error?.message || 'Không thể đổi voucher. Vui lòng thử lại.');
    } finally {
      setRedeemingId(null);
    }
  };

  const campaignList = useMemo(() => campaigns, [campaigns]);
  const ownedVoucherIdSet = useMemo(() => {
    if (!Array.isArray(ownedVouchers)) return new Set();
    return new Set(
      ownedVouchers
        .map((v) => v?.voucherId || v?.id)
        .filter((id) => id !== null && id !== undefined),
    );
  }, [ownedVouchers]);
  const groupedTransactions = useMemo(() => groupTransactions(transactions), [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
            <p className="text-gray-500 text-sm">Điểm Eco hiện có</p>
            <p className="text-3xl font-semibold text-green-600">
              {ecoPointLoading ? 'Đang tải...' : `${availablePoints.toLocaleString('vi-VN')} điểm`}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-gray-500 text-sm">Điểm tích lũy</p>
            <p className="text-3xl font-semibold text-emerald-600">
              {ecoPointLoading ? '—' : `${lifetimePoints.toLocaleString('vi-VN')} điểm`}
            </p>
          </div>
          {ecoPointError && (
            <p className="text-sm text-red-500 mt-1 col-span-full">{ecoPointError}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button icon={<ReloadOutlined />} onClick={fetchCampaigns} loading={campaignLoading}>
            Tải danh sách
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">Chiến dịch đang mở</h3>
          {campaignError && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg p-3">
              {campaignError}
            </div>
          )}
          {campaignList.length === 0 && !campaignLoading ? (
            <Empty description="Chưa có chiến dịch nào" />
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-auto pr-1">
              {campaignList.map((campaign) => {
                const id = campaign.campaignId || campaign.id;
                const isSelected = selectedCampaign && (selectedCampaign.campaignId || selectedCampaign.id) === id;
                return (
                  <button
                    key={id}
                    onClick={() => selectCampaign(campaign)}
                    className={`w-full text-left rounded-2xl border p-4 transition ${
                      isSelected ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-300'
                    }`}
                  >
                    <p className="text-sm text-gray-500 mb-1">Chiến dịch</p>
                    <p className="text-lg font-semibold text-gray-900">{campaign.campaignName || campaign.name}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {campaign.campaignDescription || campaign.description || '—'}
                    </p>
                    <div className="text-xs text-gray-500">
                      {campaign.startDate && (
                        <span>Bắt đầu: {formatDateVN(campaign.startDate, 'DD/MM/YYYY HH:mm')}</span>
                      )}
                      {campaign.endDate && (
                        <span className="ml-2">Kết thúc: {formatDateVN(campaign.endDate, 'DD/MM/YYYY HH:mm')}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">Voucher trong chiến dịch</h3>
          {!selectedCampaign ? (
            <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-500">
              Chọn một chiến dịch để xem danh sách voucher có thể đổi
            </div>
          ) : voucherLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-10 w-10 border-4 border-green-200 border-t-green-600 rounded-full" />
            </div>
          ) : vouchers.length === 0 ? (
            <Empty description="Chiến dịch này chưa có voucher để đổi" />
          ) : (
            <div className="space-y-4 max-h-[520px] overflow-auto pr-1">
              {vouchers.map((voucher) => {
                const voucherId = voucher.voucherId || voucher.id;
                const requiredPoints = voucher.pointToRedeem || 0;
                const alreadyOwned = ownedVoucherIdSet.has(voucherId);
                const canRedeem = !alreadyOwned && availablePoints >= requiredPoints;
                return (
                  <div
                    key={voucherId}
                    className="border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Tên voucher</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {voucher.name || voucher.code || '—'}
                        </p>
                        {voucher.code && voucher.name && (
                          <p className="text-xs text-gray-400 mt-0.5">Mã: {voucher.code}</p>
                        )}
                      </div>
                      <Tag color={alreadyOwned ? 'blue' : canRedeem ? 'green' : 'red'}>
                        {alreadyOwned ? 'Đã đổi' : canRedeem ? 'Đủ điểm' : 'Thiếu điểm'}
                      </Tag>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {voucher.description || 'Voucher ưu đãi đặc biệt từ chiến dịch này.'}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-3">
                      <div>
                        <p className="text-gray-500 text-xs">Giá trị</p>
                        <p className="font-semibold text-gray-900">
                          {voucher.value ? voucher.value.toLocaleString('vi-VN') : 0}
                          {voucher.voucherType === 'PERCENT' ? '%' : 'đ'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Điểm cần đổi</p>
                        <p className="font-semibold text-gray-900">{requiredPoints.toLocaleString('vi-VN')} điểm</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Đơn tối thiểu</p>
                        <p className="font-semibold text-gray-900">
                          {voucher.minOrderValue
                            ? `${voucher.minOrderValue.toLocaleString('vi-VN')}đ`
                            : 'Không yêu cầu'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Hạn sử dụng</p>
                        <p className="font-semibold text-gray-900">
                          {voucher.expiryDate ? formatDateVN(voucher.expiryDate) : 'Không xác định'}
                        </p>
                      </div>
                    </div>
                    <Button
                      icon={<GiftOutlined />}
                      type="primary"
                      className="mt-4 bg-green-600 hover:bg-green-700 border-none"
                      block
                      disabled={!canRedeem || ecoPointLoading}
                      loading={redeemingId === voucherId}
                      onClick={() => handleRedeem(voucher)}
                    >
                      {alreadyOwned ? 'Đã sở hữu' : 'Đổi voucher'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700">Giao dịch điểm gần đây</h3>
        {ecoPointLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-green-200 border-t-green-600 rounded-full" />
          </div>
        ) : groupedTransactions.length === 0 ? (
          <Empty description="Chưa có giao dịch điểm" />
        ) : (
          <div className="space-y-3">
            {groupedTransactions.map((group, index) => {
              const { meta, latestTx, count } = group;
              const amountLabel = `${meta.isSpend ? '-' : '+'}${meta.absPoints.toLocaleString('vi-VN')} điểm`;
              const dateText = latestTx?.createdAt
                ? new Date(latestTx.createdAt).toLocaleString('vi-VN')
                : 'Không xác định';
              return (
                <div
                  key={`${group.meta.description}-${group.meta.actionType}-${index}`}
                  className="border border-gray-100 rounded-2xl p-4 shadow-sm bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {meta.description}
                      </p>
                      <p className="text-xs text-gray-500">{dateText}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {count > 1 && (
                        <span className="text-xs font-semibold text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded-full">
                          x{count}
                        </span>
                      )}
                      <Tag color={meta.isSpend ? 'red' : 'green'} className="text-sm font-semibold">
                        {amountLabel}
                      </Tag>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {meta.actionType || 'Không xác định'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RedeemVoucherTab;

