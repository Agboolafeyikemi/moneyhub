/* eslint-disable max-statements */
import { add, format } from "date-fns";
import React, { useEffect, useState } from "react";
import { getAccount } from "../../services/getAccount";
import { Button } from "../../components/button";
import { Label } from "../../components/label";
import RowContainer from "../../components/row-container";
import {
  AccountHeadline,
  AccountLabel,
  AccountList,
  AccountListItem,
  AccountListItemTwoColumn,
  AccountSection,
  InfoText,
  Inset,
} from "./style";

const Detail = ({}) => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const updateAccount = async () => {
      const fetchAccount = await getAccount();
      setAccount(fetchAccount.account);
      setLoading(false);
    };

    updateAccount();
  }, []);

  if (loading) {
    return <Inset>Loading data…</Inset>;
  }

  let mortgage;
  const lastUpdate = new Date(account.lastUpdate);
  if (account.associatedMortgages.length) {
    mortgage = account.associatedMortgages[0];
  }

  // Format original purchase price date
  const originalPurchasePriceDate = new Date(account.originalPurchasePriceDate);
  // Account recent valuation amount - original purchase price
  const sincePurchase =
    account.recentValuation.amount - account.originalPurchasePrice;
  // Since purchase / original purchase price * 100
  const sincePurchasePercentage =
    (sincePurchase / account.originalPurchasePrice) * 100;

  // Since purchase percentage / number of years since purchase
  // Work out number of years since purchased date
  const yearToday = format(new Date(), "yyyy");
  const yearPurchased = format(originalPurchasePriceDate, "yyyy");

  const numberOfYearsSincePurchase = yearToday - yearPurchased;

  const annualAppreciation =
    sincePurchasePercentage / numberOfYearsSincePurchase;

  const formatOriginalPurchasePrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Math.abs(account.originalPurchasePrice));

  return (
    <Inset>
      <AccountSection>
        <AccountLabel>Estimated Value</AccountLabel>
        <AccountHeadline>
          {new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
          }).format(account.recentValuation.amount)}
        </AccountHeadline>
        <AccountList>
          <AccountListItem>
            <InfoText>
              {`Last updated ${format(lastUpdate, "do MMM yyyy")}`}
            </InfoText>
          </AccountListItem>
          <AccountListItem>
            <InfoText>
              {`Next update ${format(
                add(lastUpdate, {
                  days: account.updateAfterDays,
                }),
                "do MMM yyyy"
              )}`}
            </InfoText>
          </AccountListItem>
        </AccountList>
      </AccountSection>
      <AccountSection>
        <AccountLabel>Property details</AccountLabel>
        <RowContainer>
          <AccountList>
            <AccountListItem>
              <InfoText>{account.name}</InfoText>
            </AccountListItem>
            <AccountListItem>
              <InfoText>{account.bankName}</InfoText>
            </AccountListItem>
            <AccountListItem>
              <InfoText>{account.postcode}</InfoText>
            </AccountListItem>
          </AccountList>
        </RowContainer>
      </AccountSection>
      <AccountSection>
        <AccountLabel>Valuation change</AccountLabel>
        <RowContainer>
          <AccountList>
            <AccountListItem>
              <InfoText>
                {`Purchased for `}
                <b>{formatOriginalPurchasePrice}</b>
                {` in ${format(originalPurchasePriceDate, "MMMM yyyy")}
                                `}
              </InfoText>
            </AccountListItem>
            <AccountListItemTwoColumn>
              <InfoText>Since purchase</InfoText>
              <Label>{`${new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
              }).format(
                Math.abs(sincePurchase)
              )} (${sincePurchasePercentage}%)`}</Label>
            </AccountListItemTwoColumn>
            <AccountListItemTwoColumn>
              <InfoText>Annual appreciation</InfoText>
              <Label>{annualAppreciation}%</Label>
            </AccountListItemTwoColumn>
          </AccountList>
        </RowContainer>
      </AccountSection>
      {mortgage && (
        <AccountSection>
          <AccountLabel>Mortgage</AccountLabel>
          <RowContainer
            // This is a dummy action
            onClick={() => alert("You have navigated to the mortgage page")}>
            <AccountList>
              <AccountListItem>
                <InfoText>
                  {new Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  }).format(
                    Math.abs(account.associatedMortgages[0].currentBalance)
                  )}
                </InfoText>
              </AccountListItem>
              <AccountListItem>
                <InfoText>{account.associatedMortgages[0].name}</InfoText>
              </AccountListItem>
            </AccountList>
          </RowContainer>
        </AccountSection>
      )}
      <Button
        // This is a dummy action
        onClick={() => alert("You have navigated to the edit account page")}>
        Edit account
      </Button>
    </Inset>
  );
};

export default Detail;
