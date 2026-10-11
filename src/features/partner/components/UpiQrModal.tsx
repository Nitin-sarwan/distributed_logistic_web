import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { formatMoney } from '@/features/pricing'

import type { UpiRequest } from '../api/paymentApi'

export interface UpiQrModalProps {
  request: UpiRequest | null
  isBusy: boolean
  onPaid: () => void
  onClose: () => void
}

/** The QR the customer scans with any UPI app, amount and reference filled in. */
export function UpiQrModal({ request, isBusy, onPaid, onClose }: UpiQrModalProps) {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    if (!request) {
      setImage(null)
      return
    }
    let current = true
    QRCode.toDataURL(request.upi_link, { width: 260, margin: 1, errorCorrectionLevel: 'M' })
      .then((url) => {
        if (current) setImage(url)
      })
      .catch(() => {
        if (current) setImage(null)
      })
    return () => {
      current = false
    }
  }, [request])

  return (
    <Modal isOpen={request !== null} onClose={onClose} title="Scan to pay" size="sm">
      {request && (
        <div className="upi-qr">
          <p className="upi-qr__amount">{formatMoney(request.amount, request.currency)}</p>
          <p className="upi-qr__ref">{request.public_ref}</p>

          <div className="upi-qr__code">
            {image ? (
              <img src={image} alt={`UPI QR code to pay ${request.payee_name}`} width={260} height={260} />
            ) : (
              <span className="upi-qr__placeholder">Preparing QR…</span>
            )}
          </div>

          <p className="upi-qr__payee">
            Pays <strong>{request.payee_name}</strong> · {request.payee_vpa}
          </p>
          <p className="upi-qr__hint">
            Ask the customer to scan with any UPI app. Tap below only once you see the
            payment succeed on their phone.
          </p>

          <div className="upi-qr__actions">
            <Button variant="secondary" onClick={onClose} disabled={isBusy}>
              Back
            </Button>
            <Button onClick={onPaid} isLoading={isBusy} loadingText="Recording…">
              Payment received
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
